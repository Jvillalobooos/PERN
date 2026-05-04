import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Navbar from './components/Navbar';
import {Container} from '@mui/system';
export default function App() {
    return (
        <BrowserRouter>
        <Navbar />
        <Container>
            <Routes>
                <Route path='/' element={<TaskList />} />
                <Route path='/tasks/new' element={<TaskForm />} />  
                <Route path='/tasks/:id/edit' element={<TaskForm />} />
            </Routes>
        </Container>
        </BrowserRouter>  
    );
}
