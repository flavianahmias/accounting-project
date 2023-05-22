import './styles.css';

/**
 * Loading component
 * @returns
 */
export default function Loading() {
  return (
    <div className="loading">
      <div className="center">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="over"></div>
    </div>
  );
}
