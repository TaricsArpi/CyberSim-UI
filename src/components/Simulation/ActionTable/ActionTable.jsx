import React from 'react';

import Mitigations from '../../Mitigations/Mitigations';
import Curveballs from './Curveballs';
import SystemRelatedActions from '../SystemRelatedActions';
import ActionItems from '../ActionItems';
import Systems from '../../Systems';

const ActionTable = () => (
  <>
    <ActionItems className="my-5 p-0" location="hq" />
    <ActionItems className="my-5 p-0 pt-3" location="local" />
    <Mitigations isInventory className="my-5 pt-3 pb-5 px-0" />
    <Systems className="my-5 pt-3" />
    <SystemRelatedActions className="my-5 pt-3" />
    <Curveballs className="my-5 pt-3" />
  </>
);

export default ActionTable;
