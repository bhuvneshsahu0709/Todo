import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil } from 'react-icons/bs';
const API_BASE = '/api';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE}/todos`)
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    }, []);

    const edit = (id) => {
        const current = todos.find(t => t._id === id);
        const nextDone = !current?.done;
        axios.put(`${API_BASE}/todos/${id}`, { done: nextDone })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: nextDone };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`${API_BASE}/todos/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    const Hdelete = (id) => {
        axios.delete(`${API_BASE}/todos/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    return (
        <main>
            <Create onCreated={(newTodo) => setTodos([newTodo, ...todos])} />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className='task' key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />}
                                {taskid === todo._id ?
                                    <input type='text' value={updatetask} onChange={e => setUpdatetask(e.target.value)} />
                                    :
                                    <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                }
                            </div>
                            <div>
                                <span>
                                    <BsPencil className='icon' onClick={() => {
                                        if (taskid === todo._id) {
                                            Update(todo._id, updatetask);
                                        } else {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                        }
                                    }} />
                                    <BsFillTrashFill className='icon' onClick={() => Hdelete(todo._id)} />
                                </span>
                            </div>
                        </div>
                    ))
            }
        </main>
    );
};

export default Home;
