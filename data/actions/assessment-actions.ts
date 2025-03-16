export async function addAssessmentAction(prevState: any) {
  const payload = {
    data: {
      documentId: prevState.documentId,
      title: prevState.title,
      description: prevState.description,
      platform: prevState.platform,
      standard: prevState.standard,
    },
  };

  let responseData;

  try {
    // Send a POST request to the API route
    if (!prevState.documentId) {
      const res = await fetch(`http://localhost:3000/api/assessments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Example user input
      });

      responseData = await res.json();
    }

    if (prevState.documentId) {
      const res = await fetch(`http://localhost:3000/api/assessments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Example user input
      });

      responseData = await res.json();
    }

    if (responseData.error) {
      console.log(responseData.error);
      return {
        success: false,
        error: {
          message:
            "Something went wrong while saving. If this persist, use the details panel below to report this to support.",
        },
        strapiErrors: responseData,
      };
    }

    if (responseData.id) {
      return {
        ...prevState,
        success: true,
        data: responseData,
        strapiErrors: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error,
    };
  }
}
