const form = document.getElementById("dataForm");
    const alerts = {
      success: document.querySelector(".success-alert"),
      error: document.querySelector(".error-alert"),
    };

    const showAlert = (type, duration = 5000) => {
      Object.values(alerts).forEach((alert) => alert?.classList.add("hidden"));
      const alertElement = alerts[type];
      alertElement?.classList.remove("hidden");

      setTimeout(() => {
        alertElement?.classList.add("hidden");
      }, duration);
    };

    const handleDownload = async (station, date) => {
      try {
        const extension = "sac";
        const response = await fetch(`/data/${station}/${date}.${extension}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const filename = `${station}_${date}.${extension}`;
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
      } catch (error) {
        console.error("Error en la descarga:", error);
        showAlert("error");
        return false;
      }
    };

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        station: form.station.value.trim(),
        date: form.date.value,
      };

      if (!formData.station || !formData.date) {
        showAlert("error", 3000);
        return;
      }

      try {
        const success = await handleDownload(formData.station, formData.date);

        if (success) {
          showAlert("success");
          form.reset();
        }
      } catch (error) {
        console.error("Error general:", error);
      }
    });