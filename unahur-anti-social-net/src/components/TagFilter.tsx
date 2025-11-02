import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Tag } from '../types';


interface Props {
    selected: number | 'all';
    onChange: (tagId: number | 'all') => void;
}


export default function TagFilter({ selected, onChange }: Props) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        api.getTags().then(setTags).finally(() => setLoading(false));
    }, []);


    if (loading) return <p className="text-muted">Cargando etiquetas…</p>;


    return (
        <div className="chips">
            <button className={`chip ${selected === 'all' ? 'active' : ''}`} onClick={() => onChange('all')}>Todas</button>
            {tags.map((t) => (
                <button key={t.id} className={`chip ${selected === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
                    #{t.name}
                </button>
            ))}
        </div>
    );
}