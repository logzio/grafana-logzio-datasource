import _ from 'lodash';

export class LogzioConfigCtrl {
  static templateUrl = './partials/config.html';
  current: any;

  /** @ngInject */
  constructor() {
    this.current.secureJsonData = this.current.secureJsonData || {};
    this.current.secureJsonFields = this.current.secureJsonFields || {};

    this.current.jsonData.timeField =
      this.current.jsonData.timeField || '@timestamp';
    this.current.jsonData.esVersion = this.current.jsonData.esVersion || 5;
    this.current.jsonData.maxConcurrentShardRequests =
      this.current.jsonData.maxConcurrentShardRequests || 256;

    this.migrateUrlAndApiKey(this.current);
  }

  indexPatternTypes = [
    { name: 'No pattern', value: undefined },
    { name: 'Hourly', value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
    { name: 'Daily', value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
    { name: 'Weekly', value: 'Weekly', example: '[logstash-]GGGG.WW' },
    { name: 'Monthly', value: 'Monthly', example: '[logstash-]YYYY.MM' },
    { name: 'Yearly', value: 'Yearly', example: '[logstash-]YYYY' },
  ];

  esVersions = [
    { name: '2.x', value: 2 },
    { name: '5.x', value: 5 },
    { name: '5.6+', value: 56 },
  ];

  indexPatternTypeChanged() {
    var def = _.find(this.indexPatternTypes, {
      value: this.current.jsonData.interval,
    });
    this.current.database = def.example || 'es-index-name';
  }

  getSuggestUrls() {
    return [
      'https://api.logz.io/v1/elasticsearch',
      'https://api-eu.logz.io/v1/elasticsearch',
    ];
  }

  migrateUrlAndApiKey(instanceSettings) {
    if (
      (!instanceSettings.jsonData.url ||
        instanceSettings.jsonData.url.length === 0) &&
      !instanceSettings.jsonData.url
    ) {
      instanceSettings.jsonData.url = instanceSettings.url || '';
    }

    if (
      !instanceSettings.secureJsonFields.apiKey &&
      instanceSettings.jsonData.headers &&
      instanceSettings.jsonData.headers.length > 0
    ) {
      const headerIndexToMigrate = instanceSettings.jsonData.headers.findIndex(
        e => {
          return e.key === 'X-API-TOKEN';
        },
      );

      if (headerIndexToMigrate > -1) {
        instanceSettings.secureJsonData.apiKey =
          instanceSettings.jsonData.headers[headerIndexToMigrate].value;
        instanceSettings.jsonData.headers.splice(headerIndexToMigrate, 1);
      }
    }
  }
}
