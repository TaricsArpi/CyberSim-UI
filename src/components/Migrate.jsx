import React, { useState, useCallback } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Image,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseState = {
  password: '',
  accessToken: '',
  tableId: '',
};

export default function Migrate() {
  const [state, setState] = useState(baseState);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [warning, setWarning] = useState(true);

  const onChange = useCallback(
    (ev) => {
      const { name, value } = ev.target;
      setState({ ...state, [name]: value });
      if (errors?.[name]) {
        setErrors({ ...errors, [errors.name]: undefined });
      }
    },
    [state, errors],
  );

  const onSubmit = useCallback(
    async (ev) => {
      try {
        setLoading(true);
        ev.preventDefault();
        ev.stopPropagation();
        await axios.post(
          `${process.env.REACT_APP_API_URL}/migrate`,
          state,
        );
        setValidationError({});
        setErrors({});
        setIsSuccess(true);
      } catch (err) {
        const error = err?.response?.data;
        if (error?.validation) {
          setValidationError(error);
          setErrors({});
        } else {
          if (error) {
            setErrors(error);
          }
          setValidationError({});
        }
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [state],
  );

  return (
    <Container fluid="md" className="mt-5 pt-5">
      <Button
        variant="outline-primary"
        className="rounded-pill navigation"
      >
        <Link to="/" className="button-link">
          <h4 className="font-weight-normal mb-0">Go Back</h4>
        </Link>
      </Button>
      <Row>
        <Col xs={12} md={{ span: 8, offset: 2 }}>
          <Row className="font-weight-bold">
            <Col>
              <h4>MIGRATE THE DATABASE</h4>
            </Col>
          </Row>
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label>
                <h5 className="font-weight-normal mb-0">
                  Master password:
                </h5>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={state.password}
                onChange={onChange}
                autoComplete="off"
                style={{ fontSize: '1.125rem' }}
                isInvalid={errors?.password}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors?.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <h5 className="font-weight-normal mb-0">
                  Airtable access token:
                </h5>
              </Form.Label>
              <Form.Control
                type="password"
                name="accessToken"
                value={state.accessToken}
                onChange={onChange}
                autoComplete="off"
                style={{ fontSize: '1.125rem' }}
                isInvalid={errors?.accessToken}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors?.accessToken}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <h5 className="font-weight-normal mb-0">
                  Airtable base id:
                </h5>
              </Form.Label>
              <Form.Control
                type="text"
                name="tableId"
                value={state.tableId}
                onChange={onChange}
                autoComplete="off"
                style={{ fontSize: '1.125rem' }}
                isInvalid={errors?.tableId}
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {errors?.tableId}
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="my-4">
              <Col>
                <Button
                  variant="outline-primary"
                  className="rounded-pill w-100"
                  type="submit"
                  disabled={
                    !state.password ||
                    !state.accessToken ||
                    !state.tableId ||
                    isLoading
                  }
                >
                  <h4 className="font-weight-normal mb-0">
                    {isLoading
                      ? 'Ongoing migration ...'
                      : isSuccess
                      ? 'Migrate the Database Again'
                      : 'Migrate the Database'}
                  </h4>
                </Button>
              </Col>
            </Row>
          </Form>
          <div className="pt-3">
            {errors?.message && (
              <h3 className="text-danger text-center">
                {errors.message}
              </h3>
            )}
            {isSuccess && (
              <h3 className="text-success text-center">
                The database was sucessfully migrated!
              </h3>
            )}
            {Boolean(validationError.errors?.length) && (
              <>
                <h3 className="text-danger text-center">
                  {validationError.message ??
                    'An unexpected error occured! Please contact the developers to fix it.'}
                </h3>
                <div>
                  {validationError.errors.map((error, index) => (
                    <Alert
                      key={index}
                      variant="danger"
                      dismissible
                      onClose={() =>
                        setValidationError(
                          (previousValidationErrors) => ({
                            ...previousValidationErrors,
                            errors:
                              previousValidationErrors.errors.filter(
                                (err) => err !== error,
                              ),
                          }),
                        )
                      }
                    >
                      <Alert.Heading>{error.message}</Alert.Heading>
                      {error.value && (
                        <div className="pre">
                          {JSON.stringify(error.value, null, 2)}
                        </div>
                      )}
                    </Alert>
                  ))}
                </div>
              </>
            )}
          </div>
          {!isSuccess && (
            <Container fluid="md" className="mt-3 mb-5 lead">
              <h3 className="text-center">Migration guide</h3>
              {warning && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setWarning(false)}
                >
                  Migrating to a new game structure will delete all
                  current game history!
                </Alert>
              )}
              <div className="mb-4">
                1. Ask your administrator for the master password and
                enter it into the "Master password" input field.
              </div>
              <div className="mb-4">
                2. Go to
                <a
                  href="https://airtable.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1"
                >
                  https://airtable.com
                </a>
                and log in.
              </div>
              <div className="mb-1">
                3. Navigate to the "Developer Hub" from the menu.
                Create a new "Personal access token".
              </div>
              <Row className="mb-4 mt-1">
                <Col sm={12}>
                  <Image
                    fluid
                    src="/settings_1.png"
                    alt="Menu - Developer Hub."
                  />
                </Col>
              </Row>
              <div className="mb-1">
                Create a new "Personal access token".
              </div>
              <Row className="mb-4 mt-1">
                <Col sm={12}>
                  <Image
                    fluid
                    src="/token_1.png"
                    alt="Create personal access token 1."
                  />
                </Col>
              </Row>
              <div className="mb-1">
                Fill the form as follows:
                <ul>
                  <li>The name is arbitrary</li>
                  <li>
                    The required scope settings:
                    <i> data.records:read, schema.bases:read</i>
                  </li>
                  <li>
                    For access select the base of the game you want to
                    migrate.
                  </li>
                </ul>
              </div>
              <Row className="mb-4 mt-1">
                <Col sm={12}>
                  <Image
                    fluid
                    src="/token_2.png"
                    alt="Create personal access token 2."
                  />
                </Col>
              </Row>
              <div className="mb-1">
                After clicking the "Create Token" button a modal will
                appear. Here you can see your personal access token.
                <b>
                  You won't be able to see this again after closing
                  the modal window, so please save it where you can
                  find it later.
                </b>
                You should copy this token into the "Airtable access
                token" input field.
              </div>
              <Row className="mb-4 mt-1">
                <Col sm={12}>
                  <Image
                    fluid
                    src="/token_3.png"
                    alt="Create personal access token 3."
                  />
                </Col>
              </Row>
              <div className="mb-1">
                4. Go to your desired airtable base and copy the
                BASE_ID segment from the
                "https://airtable.com/BASE_ID/TABLE_ID/ETC..." page
                url into the "Airtable base id" input field.
              </div>
              <Row>
                <Col sm={12}>
                  <Image
                    fluid
                    src="/table_id.png"
                    alt="Find airtable table id"
                  />
                </Col>
              </Row>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}
