// Initialize ApperClient
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient("dcb8b96da05e455c94980ac49d8cd8d2");
};

// Authentication services
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      apperClient.login(email, password)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const registerUser = (email, password, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      apperClient.register(email, password, {
        firstName,
        lastName
      })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const logoutUser = () => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      apperClient.logout()
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// Data services for calculations
export const fetchCalculations = () => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      const params = {
        fields: ["Id", "Name", "expression", "result", "timestamp", "operation_type"],
        pagingInfo: { 
          limit: 10, 
          offset: 0 
        },
        orderBy: [
          { field: "timestamp", direction: "desc" }
        ]
      };
      
      apperClient.fetchRecords("calculation", params)
        .then(response => {
          if (response && response.data) {
            resolve(response.data);
          } else {
            resolve([]);
          }
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const createCalculation = (calculationData) => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      const params = {
        record: {
          Name: calculationData.name || `Calculation ${Date.now()}`,
          expression: calculationData.expression,
          result: calculationData.result.toString(),
          timestamp: new Date().toISOString(),
          operation_type: calculationData.operationType
        }
      };
      
      apperClient.createRecord("calculation", params)
        .then(response => {
          if (response && response.data) {
            resolve(response.data);
          } else {
            reject(new Error("Failed to create calculation"));
          }
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteCalculation = (calculationId) => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getClient();
      
      apperClient.deleteRecord("calculation", calculationId)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};