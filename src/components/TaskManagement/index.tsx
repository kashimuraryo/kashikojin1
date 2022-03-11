import { useState, useEffect }  from 'react';
import { db } from '../../firebase';
import CommonDialog from '../CommonDialog';
import { doc, getDocs, addDoc, collection, deleteDoc } from 'firebase/firestore';
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
  timeStamp: string;
};

function TaskManagement() {
  const classes = useStyle();
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskText, setTaskText] = useState<string>('');
  // const [taskChecked, setTaskChecked] = useState<boolean>(false);
  const [isOpenDeleteConfirm, setIsOpenDeleteConfirm] = useState(false);
 
  // 表示
  const dispData = () => {
    const tasksCollectionRef = collection(db, 'tTasks');
    getDocs(tasksCollectionRef).then((querySnapshot) => {
      const  userList: Task[] = [];
      let count: number = 0;
      querySnapshot.docs.map((doc, index) => {
        const task: Task = {
          docId: doc.id,
          taskText: doc.data().taskText,
          timeStamp: doc.data({serverTimestamps:"estimate"}).timeStamp,
        };
        userList.push(task);
        count += 1;
      });
      setTaskList(userList);
    });
  };

  // 登録
  const addTask = (inputText: string) => {
    if (inputText === '') {
      return;
    };
    const tasksCollectionRef = collection(db, 'tTasks');
    const nowTime = new Date();
    const nowYear = nowTime.getFullYear();
    const nowMonth = nowTime.getMonth();
    const nowDay = nowTime.getDate();
    const nowHour = nowTime.getHours();
    const nowMin = nowTime.getMinutes();
    const nowSec = nowTime.getSeconds();
    const documentRef = addDoc(tasksCollectionRef, {
      taskText: inputText,
      timeStamp: `${nowYear}/${nowMonth}/${nowDay} ${nowHour}:${nowMin}:${nowSec}`,
    });
    setTaskText('');
    dispData();
  };

  // 削除(確認)
  const deleteTaskConfirm = () => {
    setIsOpenDeleteConfirm(true);
  };

  // 削除
  const deleteTask = async(docId: string) => {
    setIsOpenDeleteConfirm(false);
    const userDocumentRef = doc(db, 'tTasks', docId);
    await deleteDoc(userDocumentRef);
    dispData();
  };

  // タスクチェックボックスのオンオフ切り替え時
  const changeTaskChecked = (blnChecked: boolean, numIndex: number) => {
    // オフ→オンのときテキストの文字色を変える
    if (blnChecked === true) {
      const taskText = document.getElementById(`taskText${numIndex}`);
      if (taskText !== null) {
        taskText.style.color = '#FF0000';
      };
    } else {
      const taskText = document.getElementById(`taskText${numIndex}`);
      if (taskText !== null) {
        taskText.style.color = '#000000';
      };
    };
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
              <>
              <TableRow key={index.toString()}>
                <TableCell>
                  <Checkbox
                    onChange={(e) => changeTaskChecked(e.target.checked, index)}  
                  />
                </TableCell>
                <TableCell>
                  <Typography id={`taskText${index.toString()}`}>
                    {user.taskText}
                  </Typography>
                  <Typography className={classes.taskTime}>
                    {user.timeStamp.toString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={deleteTaskConfirm}
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      fixedWidth
                    />
                  </Button>
                </TableCell>
              </TableRow>
              <CommonDialog
                msg="このタスクを削除しますか？"
                isOpen={isOpenDeleteConfirm}
                doYes={() => {deleteTask(user.docId)}}
                doNo={() => {setIsOpenDeleteConfirm(false)}}
              />
              </>
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
