import React, { useState, useEffect } from 'react';
import { AJax } from 'Hooks';
import { Loading } from 'UILib';

const Detail = (key) => {
  // const { data, isLoading } = useAjax(key);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  useEffect(() => {
    AJax.request(key)
      .then((e) => {
        setData(e.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  });
  return (
    <div>
      isLoading && <Loading />
      !isLoading &&
      <div>
        <div>{data.num}</div>
        <div>{data.str}</div>
      </div>
    </div>
  );
};
