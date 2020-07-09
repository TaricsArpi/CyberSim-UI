import React, { useMemo } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { reduce as _reduce, map as _map } from 'lodash';
import { view } from '@risingstack/react-easy-state';

import AvailableActionItems from './AvailableActionItems';
import NotAvailableActionItems from './NotAvailableActionItems';
import { gameStore } from '../GameStore';
import { useStaticData } from '../StaticDataProvider';

const ActionItems = view(({ className, location }) => {
  const { systems: gameSystems } = gameStore;
  const { actions, systems } = useStaticData();

  const actionListByRoles = useMemo(() => {
    const actionsWithSystems = _map(actions, (action) => {
      action.unavailableSystems = action.required_systems.filter(
        (system) => !gameSystems[system],
      );
      return action;
    });

    return _reduce(
      actionsWithSystems,
      (result, action) => {
        if (action.type !== location) {
          return result;
        }

        const actionAvailability =
          action.unavailableSystems.length === 0
            ? 'available'
            : 'notAvailable';

        action.roles.forEach((role) => {
          (result[role] ||
            (result[role] = { available: [], notAvailable: [] }))[
            actionAvailability
          ].push(action);
        });

        return result;
      },
      {},
    );
  }, [actions, gameSystems, location]);

  return (
    <Container className={className} id="actions">
      {_map(actionListByRoles, (actions, role) => (
        <div className="my-5" key={role}>
          <Row>
            <Col>
              <h3 className="border-bottom border-primary text-uppercase">
                {role}
              </h3>
            </Col>
          </Row>
          <AvailableActionItems
            actionList={actions.available}
            role={role}
          />
          <NotAvailableActionItems
            systems={systems}
            actionList={actions.notAvailable}
            role={role}
          />
        </div>
      ))}
    </Container>
  );
});

export default ActionItems;
