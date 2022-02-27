import { useState,useEffect }  from 'react';
import { db } from '../../firebase';
import { doc, getDocs, addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { Button, TextField, Checkbox } from '@mui/material'
import 'react-tabs/style/react-tabs.css';

type Task = {
  docId: string;
  taskText: string;
  timestamp: Date;
};

function HouseholdAccountbook() {
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
            timestamp: doc.data({serverTimestamps:"estimate"}).timestamp.toDate(),
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
    const documentRef = addDoc(usersCollectionRef, {
      taskText: inputText,
      timestamp: serverTimestamp(),
    });
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
      <div>
        {taskList.map((user, index) => (
          <div key={index.toString()}>
            <Checkbox />
            {`${user.taskText} ${user.timestamp}`}
            <Button
              variant="outlined"
              color="error"
              onClick={() => deleteTask(user.docId)}
            >削除</Button>
          </div>
        ))}
      </div>

      <div>
        <Checkbox />
        <TextField
          value={taskText}
          label="Todoを入力..."
          variant="filled" 
          size="small"
          fullWidth
          onChange={(e) => {setTaskText(e.target.value)}}
        />
      </div>
      
      <Button onClick={() => addTask(taskText)}>登録</Button>
    </>
  );
}

export default HouseholdAccountbook;
