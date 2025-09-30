export const environment = {
    production: true,
    // api base url
    apiBaseUrl: 'https://aci-playbook-peerai.azurewebsites.net',
    documentationUrl: 'https://playbook-workbench-gnduhmezc0h7gmac.eastus-01.azurewebsites.net',
    // app_id
    app_id: "67daf330d62c5ade928150d1",
    // model_name
    model_name: "azure/gpt-4o",
    top_k: 3,
    keycloak: {
        url: 'http://localhost:8080',
        realm: 'aci-playbook',
        clientId: 'cx-aci-playbook'
    },
  };