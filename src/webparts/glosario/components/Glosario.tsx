import * as React from 'react';
import { IGlosarioProps } from './IGlosarioProps';
import styles from './Glosario.module.scss';
import { SPFI } from '@pnp/sp';
import { getSP } from '../../../pnpjsConfig';
import "@pnp/sp/items";
import "@pnp/sp/lists";

interface IGlosarioItem {
  Title: string;
  Descripcion: string;
}

const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');

const Glosario: React.FC<IGlosarioProps> = ({ itemsPerPage, context }) => {
  const [sp] = React.useState<SPFI>(getSP(context));
  const [items, setItems] = React.useState<IGlosarioItem[]>([]);
  const [filtered, setFiltered] = React.useState<IGlosarioItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [letter, setLetter] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    sp.web.lists.getByTitle("Glosario").items.select("Title", "Descripcion").top(4999)().then(setItems);
  }, []);

  React.useEffect(() => {
    let result = [...items];
    if (searchTerm) result = result.filter(i => i.Title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (letter) result = result.filter(i => i.Title.toUpperCase().startsWith(letter));
    setFiltered(result);
    setPage(1);
  }, [items, searchTerm, letter]);

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className={styles.glosario}>
      <input type="text" placeholder="Buscar término..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      
      <div className={styles.abecedario}>
        {abecedario.map(l => (
          <button key={l} onClick={() => setLetter(l)} className={letter === l ? styles.selected : ''}>{l}</button>
        ))}
        <button onClick={() => setLetter(null)}>Todos</button>
      </div>

      <ul>
        {paginated.map((item, idx) => (
          <li key={idx}>
            <strong>{item.Title}</strong><br />
            <span>{item.Descripcion}</span>
          </li>
        ))}
      </ul>

      <div className={styles.paginacion}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
        <span>Página {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente →</button>
      </div>
    </div>
  );
};

export default Glosario;
