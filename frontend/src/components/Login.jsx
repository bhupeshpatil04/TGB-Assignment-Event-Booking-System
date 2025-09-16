import React, {useState} from 'react';
import axios from 'axios';
export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');
  async function submit(e){
    e.preventDefault();
    try{
      const resp = await axios.post(import.meta.env.VITE_API_URL + '/auth/login', { email, password });
      const { accessToken, refreshToken, user } = resp.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      setMsg('Logged in as ' + user.email + ' (' + user.role + ')');
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  }
  return (<div>
    <h3>Login</h3>
    <form onSubmit={submit}>
      <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/></div>
      <div><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password"/></div>
      <button>Login</button>
    </form>
    <div>{msg}</div>
  </div>)
}
