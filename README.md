# Logz.io data source for Grafana

Please note that this pluging is for our old metrics solution and will be depreacted in the near future 

Logz.io is an official Grafana data source plugin.
The plugin allows you to view your Logz.io-stored metrics in a Grafana instance that you manage.

### Install Logz.io datasource for Grafana

**You'll need**:
Write access to Grafana,
Logz.io API access

#### 1. Install the plugin

Download the plugin to your Grafana server.

```shell
grafana-cli plugins install logzio-datasource
```

#### 2. Configure the plugin

In the Grafana main menu, click the gear, and then select **Data Sources**.

Click **Add data source** (upper right of the window) and choose **Logz.io**.
You're taken to the Logz.io _Settings_ page.

In **Logz.io Url**, type your region's base API URL.
For more information on finding your account's region, see [Account region](https://docs.logz.io/user-guide/accounts/account-region.html).

In **Logz.io API Key**, paste an [API token](https://app.logz.io/#/dashboard/settings/api-tokens) from the account you want to use.

Leave the _Elasticsearch details_ section as it is—Logz.io overrides these settings.

Click **Save & Test**.
If the test passes, you can now use Logz.io as a data source.
