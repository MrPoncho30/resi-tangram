useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        axios
          .get("http://localhost:8000/timer/")
          .then((response) => {
            setElapsedTime(response.data.elapsed_time);
          })
          .catch((error) => {
            console.error("Error al obtener el tiempo:", error);
          });
      }, 1000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  