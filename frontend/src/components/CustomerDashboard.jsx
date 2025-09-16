import React, {useEffect, useState} from 'react';
import axios from 'axios';
export default function CustomerDashboard(){
  const [events,setEvents]=useState([]);
  useEffect(()=>{ axios.get((import.meta.env.VITE_API_URL||'http://localhost:4000/api') + '/events').then(r=>setEvents(r.data)).catch(()=>{}) },[]);
  return (<div>
    <h3>Events</h3>
    {events.length===0 && <div>No events yet</div>}
    <ul>{events.map(e=> <li key={e.id}>{e.title} — {e.location} — {new Date(e.startAt).toLocaleString()}</li>)}</ul>
  </div>)
}
