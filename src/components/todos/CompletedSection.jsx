import {useState} from 'react';
import TodoItem from './TodoItem';

function CompletedSection({
    tasks,
    onToggle,
    onDelete,
    onEdit,
    count
}) {
    const [isOpen, setIsOpen]=useState(true);

    if (count===0) return null;

    return(
        <section id='completed-section'>
         <details open={isOpen}>
            <summary onClick={() => setIsOpen(!isOpen)}>Completed task ({count})</summary>
            <div className='completed-list' id='completed-task'>
                {tasks.map(todo => (
                    <TodoItem 
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    />
                ))}
            </div>
            </details>   
        </section>
    )
}

export default CompletedSection;