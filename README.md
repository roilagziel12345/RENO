# Renovate on Kind

Only two files run Renovate: `config.js` and `k8s/renovate-cronjob.yaml`.

Edit the full GitHub URLs in `config.js`. Renovate scans each repository recursively and opens pull requests for dependency updates.

Create the Kind resources (replace `YOUR_GITHUB_TOKEN`; do not commit it):

```powershell
kubectl create namespace renovate
kubectl -n renovate create secret generic renovate-token --from-literal=RENOVATE_TOKEN=YOUR_GITHUB_TOKEN
kubectl -n renovate create configmap renovate-config --from-file=config.js=config.js
kubectl -n renovate apply -f k8s/renovate-cronjob.yaml
```

The CronJob runs daily at 02:00. Run it immediately when needed:

```powershell
kubectl -n renovate create job --from=cronjob/renovate renovate-now
kubectl -n renovate logs -f job/renovate-now
```

After changing `config.js`, refresh the ConfigMap and restart the next job:

```powershell
kubectl -n renovate create configmap renovate-config --from-file=config.js=config.js --dry-run=client -o yaml | kubectl apply -f -
```
