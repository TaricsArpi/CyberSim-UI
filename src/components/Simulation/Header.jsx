import React from 'react';
import { Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { SimulationTabs } from '../../constants';

const Header = ({ activeTab, setActiveTab }) => (
  <div className="position-sticky bg-white text-center simulation-menu shadow">
    <Row className="m-0 border-primary border-bottom">
      <Col
        xs={3}
        className={classNames(
          'simulation-menu-item cursor-pointer border-primary border-right p-0',
          {
            active: activeTab === SimulationTabs.ACTION_TABLE,
          },
        )}
        onClick={() => setActiveTab(SimulationTabs.ACTION_TABLE)}
      >
        <h5 className="my-2">ACTION TABLE</h5>
      </Col>
      <Col
        xs={3}
        className={classNames(
          'simulation-menu-item cursor-pointer border-primary border-right p-0',
          {
            active: activeTab === SimulationTabs.CAMPAIGN_HQ,
          },
        )}
        onClick={() => setActiveTab(SimulationTabs.CAMPAIGN_HQ)}
      >
        <h5 className="my-2">CAMPAIGN HQ</h5>
      </Col>
      <Col
        xs={3}
        className={classNames(
          'simulation-menu-item cursor-pointer border-primary border-right p-0',
          {
            active: activeTab === SimulationTabs.LOCAL_BRANCH,
          },
        )}
        onClick={() => setActiveTab(SimulationTabs.LOCAL_BRANCH)}
      >
        <h5 className="my-2">LOCAL BRANCH</h5>
      </Col>
      <Col
        xs={3}
        className={classNames(
          'simulation-menu-item cursor-pointer p-0',
          {
            active: activeTab === SimulationTabs.LOGS_AND_THREATS,
          },
        )}
        onClick={() => setActiveTab(SimulationTabs.LOGS_AND_THREATS)}
      >
        <h5 className="my-2">EVENT LOGS</h5>
      </Col>
    </Row>
    <Row className="m-0 border-primary border-bottom">
      {activeTab === SimulationTabs.ACTION_TABLE && (
        <>
          <Col
            xs={3}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document.querySelector('#hq_actions')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">HQ ACTIONS</p>
          </Col>
          <Col
            xs={3}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document
                .querySelector('#local_actions')
                ?.scrollIntoView({
                  behavior: 'smooth',
                })
            }
          >
            <p className="my-0">LOCAL ACTIONS</p>
          </Col>
          <Col
            xs={3}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document.querySelector('#curveball')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">CURVEBALL EVENTS</p>
          </Col>
          <Col
            xs={3}
            className="simulation-menu-item--small cursor-pointer p-0"
            onClick={() =>
              document.querySelector('#systems')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">TECHNICAL SYSTEMS</p>
          </Col>
        </>
      )}
      {(activeTab === SimulationTabs.CAMPAIGN_HQ ||
        activeTab === SimulationTabs.LOCAL_BRANCH) && (
        <>
          <Col
            xs={4}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document.querySelector('#injects')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">EVENTS & RESPONSES</p>
          </Col>
          <Col
            xs={4}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document.querySelector('#mitigations')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">PURCHASES</p>
          </Col>
          <Col
            xs={4}
            className="simulation-menu-item--small cursor-pointer p-0"
            onClick={() =>
              document
                .querySelector('#systme_actions')
                ?.scrollIntoView({
                  behavior: 'smooth',
                })
            }
          >
            <p className="my-0">TECHNICAL SYSTEM ACTIONS</p>
          </Col>
        </>
      )}
      {activeTab === SimulationTabs.LOGS_AND_THREATS && (
        <>
          <Col
            xs={6}
            className="simulation-menu-item--small cursor-pointer border-primary border-right p-0"
            onClick={() =>
              document.querySelector('#threats')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">THREATS</p>
          </Col>
          <Col
            xs={6}
            className="simulation-menu-item--small cursor-pointer p-0"
            onClick={() =>
              document.querySelector('#logs')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
          >
            <p className="my-0">EVENT LOG</p>
          </Col>
        </>
      )}
    </Row>
  </div>
);

export default Header;
