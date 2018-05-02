import {LogzioDatasource} from './datasource';
import {LogzioQueryCtrl} from './query_ctrl';
import {LogzioConfigCtrl} from './config_ctrl';

class LogzioQueryOptionsCtrl {
  static templateUrl = 'partials/query.options.html';
}

class LogzioAnnotationsQueryCtrl {
  static templateUrl = 'partials/annotations.editor.html';
}

export {
  LogzioDatasource as Datasource,
  LogzioQueryCtrl as QueryCtrl,
  LogzioConfigCtrl as ConfigCtrl,
  LogzioQueryOptionsCtrl as QueryOptionsCtrl,
  LogzioAnnotationsQueryCtrl as AnnotationsQueryCtrl,
};
