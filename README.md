# beampressk

A [Flask](http://flask.pocoo.org/) web server implementation to host and control *presentations* built with [beampress.js](https://github.com/jcurbelo/beampress). It leverages the usage of Flask Socket and Socket to add _real-time_ control over the slides.
> If you want to use only the "static" version go to [beampress.js](https://github.com/jcurbelo/beampress)

## How to use it

1. Clone this repo using your preferred method:

    ```bash
    # HTTPS
    $ git clone https://github.com/jcurbelo/beampressk.git

    # SSH
    $ git clone https://github.com/jcurbelo/beampressk.git

    # GitHub CLI
    $ gh repo clone jcurbelo/beampressk
    ```

2. Install dependencies with [pipenv](https://pipenv.readthedocs.io/en/latest/):

    ```bash
    # cd to application's root and then
    $ pipenv install
    ```

3. Define environment variables with [`.env`](https://pipenv-fork.readthedocs.io/en/latest/advanced.html#automatic-loading-of-env) file:

    ```bash
    # python-dotenv searches for a .env file located at root
    SECRET_KEY=YOUR_SECRET_KEY
    BASIC_AUTH_USERNAME=YOUR_ADMIN_USER
    BASIC_AUTH_PASSWORD=YOUR_ADMIN_PASSWORD
    ```

4. Run Flask server using [Flask CLI](https://flask.palletsprojects.com/en/1.1.x/cli/):

    ```bash
    $ pipenv run flask run

    # or activate virtual env
    $ pipenv shell

    # and then run it with your local installation
    (beampressk) $ flask run

    # example output
    Loading .env environment variables…
    * Serving Flask app "beampressk" (lazy loading)
    * Environment: development
    * Debug mode: on
    * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
    * Restarting with stat
    * Debugger is active!
    * Debugger PIN: 311-574-148
    ```

5. Navigate to the "admin" view: `http://localhost:5000` and authenticate using the admin credentials defined on step 3 `ADMIN_USER` and `ADMIN_PASSWORD`.
    > All "admin" (protected) views use [Basic Access Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with [Flask-BasicAuth](https://flask-basicauth.readthedocs.io/en/latest/). The purpose of beampressk is to be accessed via a "local" network, we don't recommend this approach for a production-like environment.
6. Navigate to any "presentation" view (e.g `http://localhost:5000/presentation/example-warsaw`) and play with the admin controls.
