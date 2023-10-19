import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import axios from 'axios';
import { keyBy as _keyBy } from 'lodash';

const StaticDataContext = React.createContext(null);

export const useStaticData = () => {
  const context = useContext(StaticDataContext);
  if (context === undefined) {
    throw new Error('StaticDataProvider not found');
  }
  return context;
};

export const StaticDataProvider = ({ children }) => {
  // LOCATIONS
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    setLocationsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/locations`)
      .then(({ data }) => {
        setLocations(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setLocationsLoading(false));
  }, [setLocations]);

  // LOCATION NAME GETTER
  const getLocationNameByType = useCallback(
    (type, defaultName = 'HQ') => {
      return !locationsLoading
        ? Object.values(locations).find(
            (location) => location.type === type,
          )?.name ?? defaultName
        : defaultName;
    },
    [locations, locationsLoading],
  );

  // SYSTEMS
  const [systemsLoading, setSystemsLoading] = useState(false);
  const [systems, setSystems] = useState([]);
  useEffect(() => {
    setSystemsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/systems`)
      .then(({ data }) => {
        setSystems(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setSystemsLoading(false));
  }, [setSystems]);

  // MITIGATIONS
  const [mitigationsLoading, setMitigationsLoading] = useState(false);
  const [mitigations, setMitigations] = useState([]);
  useEffect(() => {
    setMitigationsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/mitigations`)
      .then(({ data }) => {
        setMitigations(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setMitigationsLoading(false));
  }, [setMitigations]);

  // INJECTIONS
  const [injectionsLoading, setInjectionsLoading] = useState(false);
  const [injections, setInjections] = useState([]);
  useEffect(() => {
    setInjectionsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/injections`)
      .then(({ data }) => {
        setInjections(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setInjectionsLoading(false));
  }, [setInjections]);

  // RESPONSES
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  useEffect(() => {
    setResponsesLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/responses`)
      .then(({ data }) => {
        setResponses(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setResponsesLoading(false));
  }, [setResponses]);

  // ACTIONS
  const [actionsLoading, setActionsLoading] = useState(false);
  const [actions, setActions] = useState([]);
  useEffect(() => {
    setActionsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/actions`)
      .then(({ data }) => {
        setActions(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setActionsLoading(false));
  }, [setActions]);

  // CURVBALLS
  const [curveballsLoading, setCurveballsLoading] = useState(false);
  const [curveballs, setCurveballs] = useState([]);
  useEffect(() => {
    setCurveballsLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/curveballs`)
      .then(({ data }) => {
        setCurveballs(_keyBy(data, 'id'));
      })
      .catch((e) => console.error(e))
      .finally(() => setCurveballsLoading(false));
  }, [setCurveballs]);

  return (
    <StaticDataContext.Provider
      value={{
        locationsLoading,
        locations,
        getLocationNameByType,
        systemsLoading,
        systems,
        mitigationsLoading,
        mitigations,
        injectionsLoading,
        injections,
        responsesLoading,
        responses,
        actionsLoading,
        actions,
        curveballsLoading,
        curveballs,
        loading:
          locationsLoading ||
          systemsLoading ||
          mitigationsLoading ||
          injectionsLoading ||
          responsesLoading ||
          curveballsLoading ||
          actionsLoading,
      }}
    >
      {children}
    </StaticDataContext.Provider>
  );
};
