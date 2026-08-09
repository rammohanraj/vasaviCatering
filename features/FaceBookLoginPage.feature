Feature: To verify the login page in Adactin

Scenario Outline: Login with different credentials
    Given the user is on the Adactin Login page
    When the user enters "<username>" and "<password>"
    And the user clicks the Login button
   Then the user should see "<result>"

 Examples:
      | username     | password        | result                  |
      | mohanraj8881 | 8R558Y          | Login successful        |