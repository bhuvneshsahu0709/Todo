import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_BASE || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000');

const Create = ({ onCreated }) => {
    const [task, setTask] = useState('');

    const createTask = () => {
        const payload = { task: task.trim() };
        if (!payload.task) return;
        axios.post(`${API_BASE}/todos`, payload)
            .then(result => {
                console.log(result.data);
                setTask('');
                if (typeof onCreated === 'function') {
                    onCreated(result.data);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <main>
            <h1>Todo List</h1>
            <div className='create-form'>
                <input
                    type='text'
                    placeholder='Enter a task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                />
                <button onClick={createTask}>ADD</button>
            </div>
        </main>
    );
};

export default Create;
