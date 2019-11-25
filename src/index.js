import QueryListScene from './QueryListScene';
import Title from './Title';
import Form from './QueryForm';
import Toolbar from './Toolbar';
import List from './List';
import Field from './Field';
import Actions from './createActions';

export const QueryForm = Form;
export const QueryList = List;
export const createActions = Actions;

QueryListScene.Title = Title;
QueryListScene.QueryForm = Form;
QueryListScene.Toolbar = Toolbar;
QueryListScene.QueryList = List;
QueryListScene.Field = Field;

QueryListScene.createActions = createActions;
export default QueryListScene;
