import { useState,useEffect }  from 'react';
import { db } from '../src/firebase';
import { doc, getDocs, addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, TextField, Checkbox } from '@mui/material'
import 'react-tabs/style/react-tabs.css';
import './App.css';
import TaskManagement from './components/TaskManagement'
import HouseholdAccountbook from './components/HouseholdAccountbook'

type Task = {
  docId: string;
  taskText: string;
  timestamp: Date;
};

function App() {
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
    <div>
      <Tabs>
        <TabList>
          <Tab>メモ</Tab>
          <Tab>家計簿</Tab>
        </TabList>
        <TabPanel>
          <TaskManagement />
        </TabPanel>
        <TabPanel>
          <HouseholdAccountbook />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default App;
