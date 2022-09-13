import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

import { auth } from "src/firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { FormControl, TextField, Button } from '@mui/material';

const Login:React.FC = (props:any) => {
  // ログインデータ
  const [isLogin, setIsLogin] = useState(true);
  // ログイン情報：メールアドレス
  const [email, setEmail] = useState('');
  // ログイン情報：パスワード
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // ログイン認証
    // ユーザー情報を取得してステートを監視、ユーザー認証に変化があった場合、ユーザーの情報を取得して条件分岐で処理をおこなう
    // @link https://firebase.google.com/docs/auth/web/manage-users?hl=ja#get_the_currently_signed-in_user
    const unSub = onAuthStateChanged(auth, (user) => {
      user && navigate("/");
    });
    return () => unSub();
  }, []);

  return (
    <>
      <h1>{isLogin ? 'ログイン' : '新しいアカウントを作成'}</h1>

      <FormControl fullWidth>
        <TextField
          name="email"
          label="E-mail"
          value={email}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
          }}
        />
        <TextField
          name="password"
          label="Password"
          value={password}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
          }}
        />
      </FormControl>

      <Button
        onClick={() => {
          console.log('クリック');
          navigate("/");
        }
      }
      >テスト</Button>

      <Button
        variant="contained"
        onClick={
          isLogin
          ? async () => {
            try {
              //Firebase ver9 compliant (modular)
              await signInWithEmailAndPassword(auth, email, password);
              navigate("/");
            } catch (error: any) {
              alert(error.message);
            }
          }
          : async () => {
            try {
              //Firebase ver9 compliant (modular)
              await createUserWithEmailAndPassword(auth, email, password);
              navigate("/");
            } catch (error: any) {
              alert(error.message);
            }
          }
        }
      >
        {isLogin ? 'ログイン' : 'アカウント作成'}
      </Button>

      <p>
        <a onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create new account ?" : "Back to login"}
        </a>
      </p>
    </>
  )
}

export default Login
