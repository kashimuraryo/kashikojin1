import { useState,useEffect }  from 'react';
import { db } from './firebase';
import { doc, getDocs, addDoc, collection, onSnapshot, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import './App.css';

type User = {
  docId: string;
  name: string;
  email: string;
  age: number;
  admin: boolean;
  timestamp: any;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const { register,
          handleSubmit,
          watch,
          formState: { errors }
        } = useForm<User>();

  // 表示
  const dispData = () => {
    const usersCollectionRef = collection(db, 'users');
    getDocs(usersCollectionRef).then((querySnapshot) => {
      const  userList: User[] = [];
      let count: number = 0;
      querySnapshot.docs.map((doc, index) => {
        // この判定は不要かも
        if (count === index ) {
          const user: User= {
            docId: doc.id,
            name: doc.data().name,
            email: doc.data().email,
            age: doc.data().age,
            admin: doc.data().admin,
            timestamp: doc.data().timestamp,
          };
          userList.push(user);
          count += 1;
        };
      });
      setUsers(userList);
    });
  };

  // 登録
  const onSubmit: SubmitHandler<User> = (data) => {
    const usersCollectionRef = collection(db, 'users');
    const documentRef = addDoc(usersCollectionRef, {
      name: data.name,
      email: data.email,
      age: data.age,
      admin: false,
      timestamp: serverTimestamp(),
    });
    dispData();
  };

  // リアルタイムで表示更新
  const dispDataRealTime = () => {
    let userList: User[] = [];
    const usersCollectionRef = collection(db, 'users');
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        const user: User= {
          docId: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          age: doc.data().age,
          admin: doc.data().admin,
          timestamp: doc.data().timestamp,
        };
        userList.push(user);
      });
      setUsers(userList);
    });
    return unsub;
  };
  
  useEffect(() => {
    dispDataRealTime();
  }, []);

  // 削除
  const deleteUser = async(docId: string) => {
    const userDocumentRef = doc(db, 'users', docId);
    await deleteDoc(userDocumentRef);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>名前</label>
          <input defaultValue="test" {...register('name')} />
        </div>
        <div>
          <label>年齢</label>
          <input defaultValue="test" {...register('age')} />
        </div>
        <div>
          <label>メールアドレス</label>
          <input defaultValue="test" {...register('email')} />
        </div>
        {errors.name && (
          <span>Error!!!</span>
        )}
        <input value="登録" type="submit" />
      </form>
      <div>
        {users.map((user, index) => (
          <div key={index.toString()}>
            {`${user.name}  ${user.age}  ${user.email}  ${user.timestamp}`}
            <button> onClick={() => deleteUser(user.docId)}削除</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
