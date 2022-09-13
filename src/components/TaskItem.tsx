import React, { useState } from 'react'

import { db } from "src/firebase";
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";

// view components
import { ListItem, TextField, Button, Grid } from '@mui/material';

interface Props {
  id: string;
  title: string;
}

const TaskItem:React.FC<Props> = (props) => {
  const [title, setTitle] = useState(props.title);
  const tasksRef = collection(db, "tasks");

  // データベースのドキュメントを更新
  // title属性だけを更新したいのでmargeオプションを有効化
  // @link https://firebase.google.com/docs/firestore/manage-data/add-data?hl=ja#set_a_document
  const editTask = async () => {
    await setDoc(
      doc(tasksRef, props.id),
      { title: title },
      { merge: true }
    )
  }

  // データベースのドキュメントを削除する
  // @link https://firebase.google.com/docs/firestore/manage-data/delete-data?hl=ja#delete_documents
  const deleteTask = async () => {
    await deleteDoc(doc(tasksRef, props.id));
  }

  return (
    <ListItem>
      <h2>{props.title}</h2>

      <Grid container spacing={2} justifyContent="flex-end">
        <TextField
          size="small"
          label="タスクを編集する"
          value={title}
          onChange={
            (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
          }
        ></TextField>

        <Button variant="contained" onClick={editTask}>編集</Button>
        <Button variant="outlined" onClick={deleteTask}>削除</Button>
      </Grid>
    </ListItem>
  )
}

export default TaskItem
