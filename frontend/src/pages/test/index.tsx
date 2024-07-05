import React, {useEffect} from 'react';
import styles from './index.less';

export default function Page() {

    const ping=()=>{

        fetch("/api/test/ping/").then(response=>response.json()).then(data=>console.log(data)).catch(error => console.error('Error:', error))
    }

    useEffect(() => {
        ping();
    }, []);

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
