export const environment = {
    production: false,
    apiBaseUrl: 'https://aci-playbook-peerai.azurewebsites.net',
    documentationUrl: 'https://playbook-workbench-gnduhmezc0h7gmac.eastus-01.azurewebsites.net',
    app_id: "67daf330d62c5ade928150d1",
    model_name: "azure/gpt-4o",
    top_k: 3,
    collection_name: "Playbook-Draft",
    keycloak: {
        url: 'http://localhost:8080',
        realm: 'aci-playbook',
        clientId: 'cx-aci-playbook'
    },
};
