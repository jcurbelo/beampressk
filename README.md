# beampressk

A [Flask](http://flask.pocoo.org/) webserver implementation to host and control *presentations* built with [beampress.js](https://github.com/jcurbelo/beampress). It leverages the usage of [Flask-SocketIO](https://github.com/miguelgrinberg/Flask-SocketIO) and [socket.io-client](https://github.com/socketio/socket.io-client) to add _real-time_ control over the slides.
> If you want to use only the "static" version go to [beampress.js](https://github.com/jcurbelo/beampress)

## How to use it

1. Clone this repo using your preferred method:

    ```bash
    # SSH
    $ git clone git@github.com:jcurbelo/beampressk.git

    # HTTPS
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

5. Navigate to the "admin" view: `/` and authenticate using the admin credentials defined on step 3 `ADMIN_USER` and `ADMIN_PASSWORD`.
    > All "admin" (protected) views use [Basic Access Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) with [Flask-BasicAuth](https://flask-basicauth.readthedocs.io/en/latest/). The purpose of beampressk is to be accessed via a "local" network, we don't recommend this approach for a production-like environment.
6. Navigate to any "presentation" view (e.g `/presentation/example-warsaw`) and play with the admin controls.

## How to add your presentations

* Put your `index.html` file in `beampressk/templates/your-presentation`, where `your-presentation` is any name of your preference.
* Navigate to `/presentation/your-presentation` URL.
* All presentations must follow [beampress.js](https://github.com/jcurbelo/beampress) requirements in order to work.
* You can use [Jinja syntax](https://jinja.palletsprojects.com/en/2.11.x/) along with [Template Inheritance](https://flask.palletsprojects.com/en/1.1.x/patterns/templateinheritance/) to better organize your presentations. Have a look at the *example_warsaw* demo presentation, it uses a base template called `warsaw_base.html`. Feel free to create your own base template.

    ```jinja
    {% extends "warsaw_base.html" %}
    {% block content %}
        <section class="frame">Hello World!</section>
    {% endblock %}
    ```

## How it looks

![Warsaw example](img/warsaw-example.gif)
