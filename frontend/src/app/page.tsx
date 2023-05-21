import React from 'react';
import Sidebar from '@/components/sidebar';
import Container from '@/components/container';
import './page.css';

export default function Home() {
  return (
    <div className="home">
      <Sidebar />
      <Container></Container>
    </div>
  );
}
