export const getPhotosOnDate = async (authToken, date) => {
  let photos = [];
  let error = null;
  try {
    const response = await fetch(
      `https://photoslibrary.googleapis.com/v1/mediaItems:search?access_token=${encodeURIComponent(
        authToken,
      )}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            dateFilter: {
              dates: {
                year: new Date(date).getFullYear(),
                month: new Date(date).getMonth() + 1,
                day: new Date(date).getDate(),
              },
            },
          },
        }),
      },
    );
    photos = await response.json();
  } catch (err) {
    console.error(err);
  }

  return { photos, error };
};
