import React, {useEffect, useState} from 'react';
import 'src/styles/App.css';

import { useNavigate } from "react-router-dom";

// Firebase ver9 modules
import { db, auth } from "src/firebase";
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";

// view components
import ButtonAppBar from "src/components/ButtonAppBar";
import TaskItem from "src/components/TaskItem";
import { FormControl, TextField, Button, List } from '@mui/material';


const App:React.FC = () => {
  const [tasks, setTasks] = useState([{id:'', title:''}]);
  const [input, setInput] = useState('');

  const navigate = useNavigate();

  // ログアウト処理
  // ユーザー情報を取得してステートを監視、ユーザー認証に変化があった場合、ユーザーの情報を取得して条件分岐で処理をおこなう
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // ユーザーが存在しない場合はログインページへ遷移させる
      !user && navigate("login");
    });
    return () => unSub();
  });

  // データベースにアクセスして、コレクション名taskを取得
  // onSnapshot()を使うことで監視状態にして、データベースで何らかの変化があった時に更新できるようにする
  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unSub = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      )
      // クリーンアップ
      return () => unSub();
    })
  }, []);

  // コレクションにタスクを追加
  // @link https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja#add_a_document
  const newTask = async (e:React.MouseEvent<HTMLButtonElement>) => {
    await addDoc(collection(db, 'tasks'), {
      title: input,
    })
    // 入力ラベルの初期化
    setInput("");
  }

  return (
    <div className="App">
      <ButtonAppBar/>

      <div className="l-wrapper">
        <div className="inner">
        <Button
          variant="contained"
          onClick={
            async () => {
              try {
                await signOut(auth);
                navigate('login');
              } catch(error: any) {
                alert(error.message);
              }
            }
          }
        >ログアウト</Button>
        </div>
      </div>

      <div className="l-wrapper">
        <div className="inner">
          <FormControl id="margin-normal" fullWidth>
            <TextField
              variant="standard"
              label="新しいタスクを追加"
              value={input}
              onChange={
                (e:React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)
              }
            />
          </FormControl>

          <Button variant="contained" fullWidth onClick={newTask} disabled={!input}>追加</Button>

          <List>
            {
              tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  title={task.title}
                />
              ))
            }
          </List>
        </div>
      </div>
    </div>
  );
}

export default App;
