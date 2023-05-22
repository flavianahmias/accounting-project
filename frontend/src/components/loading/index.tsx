import './styles.css';

type LoadingType = 'horizontal' | 'circle';

interface IProps {
  loadingType: LoadingType;
}

/**
 * Loading component
 * @returns
 */
export const Loading = ({ loadingType }: IProps) => {
  return (
    <>
      {loadingType === 'horizontal' ? (
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
      ) : (
        <>
          <div className="roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      )}
    </>
  );
};
