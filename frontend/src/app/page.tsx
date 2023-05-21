import React from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

export default function Home() {
  return (
    <div className="home">
      <Sidebar />
      <Container>
        <div className="transactions__container">
          <div className="forms">Formulario </div>

          <div className="list">
            <section className="table"></section>
            <section className="visualization"></section>
          </div>
        </div>
      </Container>
    </div>
  );
}
