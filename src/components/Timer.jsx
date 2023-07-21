import React, { useEffect, useState } from 'react';
import '../assets/styles/styles.css';

const Timer = () => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        let intervalId;

        const startTimer = () => {
            intervalId = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 1) {
                        clearInterval(intervalId);
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        };

        startTimer();

        const resetTimer = () => {
            setSeconds(60);
        };

        const resetIntervalId = setInterval(() => {
            resetTimer();
            startTimer();
        }, 60000);

        return () => {
            clearInterval(intervalId);
            clearInterval(resetIntervalId);
        };
    }, []);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className='flex justify-center items-center my-auto '>
            <h1 className='text-2xl font-semibold antialiased text-center text-slate-50'>Actualisation dans: {formatTime(seconds)}</h1>
        </div>
    );
};

export default Timer;