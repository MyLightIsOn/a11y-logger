"use server";

export async function analyzeIssueAction(
  userId: string,
  assessment_id: string,
  prevState: any,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    description: rawFormData.description,
  };
  console.log("HEEEEEIIII");
  console.log(assessment_id);
  console.log(userId);
  console.log(prevState);
  try {
    // Send a POST request to the API route
    const res = await fetch(`http://localhost:3000/api/analyze-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: payload.description,
      }), // Example user input
    });

    const responseData = await res.json();
    responseData.assessment_id = assessment_id;

    if (responseData.success) {
      return {
        ...prevState,
        message: "Success",
        data: responseData,
        strapiErrors: null,
      };
    } else {
      return {
        ...prevState,
        strapiErrors: responseData.error,
        message: "Issue Analysis Failed",
      };
    }
  } catch (error) {
    return {
      ...prevState,
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }
}

export async function addIssueAction(prevState: any, formData: FormData) {
  const payload = {
    data: {
      id: formData.id,
      title: formData.title,
      severity: formData.severity,
      original_description: formData.original_description,
      updated_description: formData.updated_description,
      impact: formData.impact,
      suggested_fix: formData.suggested_fix,
      assessment: {
        connect: [`${formData.assessment_id}`],
      },
    },
  };

  try {
    // Send a POST request to the API route
    const res = await fetch(`http://localhost:3000/api/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Example user input
    });

    const responseData = await res.json();

    if (responseData.error) {
      return {
        success: false,
        error: responseData.error,
      };
    }

    if (responseData.data.id) {
      return {
        ...prevState,
        success: true,
        data: responseData.data.data,
        strapiErrors: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
}
