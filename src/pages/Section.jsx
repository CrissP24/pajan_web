import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const Section = () => {
  const { name } = useParams();
  const [contents, setContents] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/content/${name}`)
      .then(res => setContents(res.data))
      .catch(err => console.error(err));
  }, [name]);

  return (
    <div className="container mt-4">
      <h2 className="text-capitalize">{name.replace("-", " ")}</h2>
      <hr />
      {contents.length === 0 && <p>No hay contenido disponible.</p>}
      {contents.map((item) => (
        <div key={item.id} className="mb-4">
          {item.title && <h4>{item.title}</h4>}
          {item.image && <img src={item.image} alt={item.title} className="img-fluid mb-2" />}
          {item.body && <p>{item.body}</p>}
        </div>
      ))}
    </div>
  );
};

export default Section;
