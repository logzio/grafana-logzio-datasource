## Logz.io data source for Grafana

This plugin is a copy of the Elasticsearch datasource with custom headers.

At the time of release, custom headers for http datasources have not been merged to the Grafana project. This is a temporary solution until the custom headers are pulled into Grafana.

###### Before you start

To complete this procedure, you'll need:

* Write access to your Grafana server
* Logz.io API access

###### To configure Logz.io as a Grafana data source

1. Fork or clone the [grafana-logzio-datasource](https://github.com/logzio/grafana-logzio-datasource) repository from GitHub.

2. Copy `grafana-logzio-datasource/dist/` to the Grafana server at `var/lib/grafana/plugins/<folder_name>/`. It doesn't matter what you name `<folder_name>`.

3. Restart Grafana.

4. In Grafana, open your Configuration, and click **Add data source**.

5. Enter these settings:

| Section | Field name | Value |
|---|---|---|
| | Name | _Custom data source name_ (This is the Data Source you'll use for your Grafana graphs.) |
| | Type | Logz.io |
| **HTTP**  | URL  | `https://api.logz.io/v1/elasticsearch` |
| **Custom Headers** | Key  | `X-API-TOKEN` |
| | Value | _Your Logz.io API token_  |
| **Elasticsearch details**  | Index name | _Custom name_ |
|  | Time field name  | `@timestamp`  |

When you're done, click **Save & Test**. If the test passes, you can now use Logz.io as a data source.

To use Logz.io as a data source, select a Logz.io source from the **Data Source** list in any Grafana graph. (This is the _Custom data source name_ that you set in step 5.)
