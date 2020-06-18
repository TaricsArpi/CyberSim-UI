import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import qs from 'query-string';
import { Alert } from 'react-bootstrap';

import { SocketEvents } from '../constants';

const queryParams = qs.parse(window.location.search);

const GameContext = React.createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('GameProvider not found');
  }
  return context;
};

export const GameProvider = ({ socket, children }) => {
  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(false);

  // POP ERROR NOTIFICATION BOX
  const [error, setError] = useState({
    message: '',
    show: false,
  });
  const errorTimeRef = useRef();
  const popError = useCallback(
    (errorMessage) => {
      setError({ message: errorMessage, show: true });
      if (errorTimeRef.current) {
        clearTimeout(errorTimeRef.current);
      }
      errorTimeRef.current = setTimeout(() => {
        setError({ message: errorMessage, show: false });
      }, 4000);
    },
    [setError],
  );

  // RECONNECT TO GAME ROOM ON CONNECTION LOSS
  useEffect(() => {
    const reconnectFunction = () => {
      if (game) {
        socket.emit(
          SocketEvents.JOINGAME,
          game.id,
          ({ error, game: g }) => {
            if (!error) {
              setGame(g);
            }
            popError(error);
          },
        );
      }
    };
    socket.on(SocketEvents.RECONNECT, reconnectFunction);
    return () => {
      socket.off(SocketEvents.RECONNECT, reconnectFunction);
    };
  }, [socket, setGame, game, popError]);

  // LISTEN TO GAME STATE UPDATES
  useEffect(() => {
    socket.on(SocketEvents.GAMEUPDATED, (g) => setGame(g));
  }, [socket, setGame]);

  // AUTO JOIN TO GAME IN QUERY PARAMS
  useEffect(() => {
    const { gameId: gameIdFromQuery, ...newParams } = queryParams;
    if (gameIdFromQuery) {
      setLoading(true);
      socket.emit(
        SocketEvents.JOINGAME,
        gameIdFromQuery,
        ({ error, game }) => {
          if (!error) {
            setGame(game);
            window.history.replaceState(
              null,
              null,
              `?${qs.stringify(newParams)}`,
            );
            localStorage.setItem('gameId', gameIdFromQuery);
          } else {
            setLoading(false);
          }
        },
      );
    }
  }, [setGame, socket, setLoading]);

  // (JOIN OR CREATE)
  const enterGame = useCallback(
    ({ eventType, gameId, rememberGameId }) => {
      setLoading(true);
      socket.emit(eventType, gameId, ({ error, game }) => {
        if (!error) {
          setGame(game);
          if (rememberGameId) {
            localStorage.setItem('gameId', gameId);
          } else {
            localStorage.removeItem('gameId');
          }
        } else {
          popError(error);
        }
        setLoading(false);
      });
    },
    [socket, setGame, popError, setLoading],
  );

  const emitEvent = useCallback(
    (event, params) =>
      params
        ? socket.emit(
            event,
            params,
            ({ error }) => error && popError(error),
          )
        : socket.emit(event, ({ error }) => error && popError(error)),
    [socket, popError],
  );

  return (
    <GameContext.Provider
      value={{
        ...game,
        actions: {
          enterGame,
          resumeSimulation: () =>
            emitEvent(SocketEvents.STARTSIMULATION),
          pauseSimulation: () =>
            emitEvent(SocketEvents.PAUSESIMULATION),
          finishSimulation: () =>
            emitEvent(SocketEvents.FINISHSIMULATION),
          toggleMitigation: (params) =>
            emitEvent(SocketEvents.CHANGEMITIGATION, params),
          startSimulation: () =>
            emitEvent(SocketEvents.STARTSIMULATION),
        },
        loading,
      }}
    >
      <div
        className="position-fixed"
        style={{
          bottom: '20px',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <Alert
          show={error.show}
          variant="danger"
          onClose={() =>
            setError({ message: error.message, show: false })
          }
          dismissible
        >
          {error.message}
        </Alert>
      </div>
      {children}
    </GameContext.Provider>
  );
};
