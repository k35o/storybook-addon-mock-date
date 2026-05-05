import React from 'react';
import { FC } from "react";

export const CurrentTime: FC = () => {
  const now = new Date();
  return <time>{now.toISOString()}</time>;
}