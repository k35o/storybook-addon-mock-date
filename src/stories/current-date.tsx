import React from "react";
import { FC } from "react";

export const CurrentDate: FC = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  return <time>{`${year}年${month}月${date}日`}</time>
}
