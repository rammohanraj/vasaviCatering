Feature: To verify the ability to search hotel in Adactin


Scenario: Search hotel with valid details
    Given the user is on the Adactin Search Hotel page
    When the user enters the required details
    And the user clicks the Search button
    Then the user should see the search results