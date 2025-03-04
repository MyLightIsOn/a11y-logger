"use server";

export async function analyzeIssueAction(
  userId: string,
  assessmentID: string,
  prevState: any,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    description: rawFormData.description,
  };
  console.log("HEEEEEIIII");
  console.log(assessmentID);
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
    responseData.assessmentID = assessmentID;

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

export async function addIssueAction(
  prevState: any,
  formData: FormData,
  assessment: string,
) {
  console.log(formData);

  const payload = {
    data: {
      id: formData.id,
      title: formData.issue_title,
      severity: formData.severity,
      original_description: formData.original_description,
      updated_description: formData.updated_description,
      impact: formData.impact,
      suggested_fix: formData.suggested_fix,
      assessment: {
        connect: [`${formData.assessmentID}`],
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
