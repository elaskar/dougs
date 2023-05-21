Feature: Dougs Synchronization

    Scenario: Synchronize correct datas
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300.50 |
            | 2  | 05-07-2023 | My second movement | 700.30 |
        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 1000.80 |
        When I synchronize
        Then I should have success

    Scenario: Synchronize correct datas with duplicate
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300.50 |
            | 1  | 05-02-2023 | My first movement  | 300.50 |
            | 2  | 05-07-2023 | My second movement | 700.30 |
        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 1000.80 |
        When I synchronize
        Then I should have success with reason duplicate id 1

    Scenario: Synchronize missing movement with positive amount
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300    |
            | 2  | 05-02-2023 | My second movement | 300    |
            | 3  | 05-09-2023 | My third movement  | -700   |
        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 600     |
            | 05-10-2023 | 200     |

        When I synchronize
        Then I should have failure with reason missing 300 on checkpoint at 10/05/2023

    Scenario: Synchronize missing movement with negative amount
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300    |
            | 2  | 05-02-2023 | My second movement | 300    |
            | 3  | 05-09-2023 | My third movement  | -700   |
        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 600     |
            | 05-10-2023 | -500    |

        When I synchronize
        Then I should have failure with reason missing -400 on checkpoint at 10/05/2023

    Scenario: Synchronize missing amount movement
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300    |
            | 2  | 05-02-2023 | My second movement | 300    |
            | 3  | 05-09-2023 | My third movement  | 0      |
        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 600     |
            | 05-10-2023 | 0       |

        When I synchronize
        Then I should have failure with reason missing amount -600 on movement with id 3



    Scenario: Synchronize movements after last checkpoint
        Given following movements :
            | Id | Date       | Wording            | Amount |
            | 1  | 05-02-2023 | My first movement  | 300    |
            | 2  | 05-02-2023 | My second movement | 300    |
            | 3  | 05-09-2023 | My third movement  | -200   |
            | 4  | 05-12-2023 | My fourth movement | -100   |

        And following checkpoints :
            | Date       | Balance |
            | 05-01-2023 | 0       |
            | 05-08-2023 | 600     |
            | 05-10-2023 | 400     |
        When I synchronize
        Then I should have failure with reason missing checkpoint at 300 after 12/05/2023