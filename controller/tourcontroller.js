const fs = require('fs');


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);


exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    createdAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getSingleTour = (req, res) => {
  const id = req.params.id * 1;
  const single = tours.find((el) => el.id === id);

  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Tour does not exist',
    });
  }

  res.status(200).json({
    status: 'success',
    tour: single,
  });
};

exports.AddTour = (req, res) => {
  const newid = tours[tours.length - 1].id + 1;
  const single = Object.assign({ id: newid }, req.body);

  tours.push(single);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Could not write to file',
        });
      }

      res.status(201).json({
        status: 'success',
        data: {
          tour: single,
        },
      });
    }
  );
};

exports.updatetour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(201).json({
    status: ' updated successfully',
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
};
