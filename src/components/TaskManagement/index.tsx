import { useState, useEffect }  from 'react';
import { db } from '../../firebase';
import { doc, getDocs, addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { Button, TextField, Checkbox } from '@mui/material'
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles
} from '@material-ui/core'
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

const useStyle = makeStyles((theme) => ({
  taskTime: {
    fontSize: '8px',
  },
}));

type Task = {
  docId: string;
  taskText: string;
  timestamp: string;
};

function TaskManagement() {
  const classes = useStyle();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState<string>('');
 
  // 表示
  const dispData = () => {
    const usersCollectionRef = collection(db, 'users');
    getDocs(usersCollectionRef).then((querySnapshot) => {
      const  userList: Task[] = [];
      let count: number = 0;
      querySnapshot.docs.map((doc, index) => {
        // この判定は不要かも
        if (count === index ) {
          const task: Task = {
            docId: doc.id,
            taskText: doc.data().taskText,
            timestamp: doc.data({serverTimestamps:"estimate"}).timestamp,
          };
          userList.push(task);
          count += 1;
        };
      });
      setTaskList(userList);
    });
  };

  // 登録
  const addTask = (inputText: string) => {
    const usersCollectionRef = collection(db, 'users');
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    const nowMonth = nowTime.getMonth();
    const nowDay = nowTime.getDate();
    const nowHour = nowTime.getHours();
    const nowMin = nowTime.getMinutes();
    const nowSec = nowTime.getSeconds();
    const documentRef = addDoc(usersCollectionRef, {
      taskText: inputText,
      timestamp: `${nowYear}/${nowMonth}/${nowDay} ${nowHour}:${nowMin}:${nowSec}`,
    });
    setTaskText('');
    dispData();
  };

  // 削除
  const deleteTask = async(docId: string) => {
    const userDocumentRef = doc(db, 'users', docId);
    await deleteDoc(userDocumentRef);
    dispData();
  };

  // 初期処理
  useEffect(() => {
    dispData();
  }, []);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
              </TableCell>
              <TableCell>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskList.map((user, index) => (
              <TableRow key={index.toString()}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Typography>
                    {user.taskText}
                  </Typography>
                  <Typography className={classes.taskTime}>
                    {user.timestamp.toString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteTask(user.docId)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      fixedWidth
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
              </TableCell>
              <TableCell>
                <TextField
                  value={taskText}
                  label="Todoを入力"
                  variant="standard" 
                  size="small"
                  fullWidth
                  onChange={(e) => {setTaskText(e.target.value)}}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => addTask(taskText)}
                >
                  ＋
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default TaskManagement;
