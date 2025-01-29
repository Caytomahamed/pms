DELIMITER //

CREATE PROCEDURE GenerateReport(
    IN tableName VARCHAR(50),
    IN reportType VARCHAR(10), -- 'daily', 'weekly', 'monthly', 'yearly'
    IN inputDate DATE,         -- Specific date for 'daily' reports
    IN inputMonth INT,         -- Specific month for 'monthly' reports
    IN inputYear INT           -- Specific year for 'yearly' or 'monthly' reports
)
BEGIN
    SET @query = CONCAT('SELECT * FROM ', tableName, ' WHERE ');

    IF reportType = 'daily' THEN
        SET @query = CONCAT(@query, 'DATE(created_at) = ', QUOTE(inputDate));
    ELSEIF reportType = 'weekly' THEN
        SET @query = CONCAT(@query, 'YEARWEEK(created_at, 1) = YEARWEEK(', QUOTE(inputDate), ', 1)');
    ELSEIF reportType = 'monthly' THEN
        SET @query = CONCAT(@query, 'MONTH(created_at) = ', inputMonth, ' AND YEAR(created_at) = ', inputYear);
    ELSEIF reportType = 'yearly' THEN
        SET @query = CONCAT(@query, 'YEAR(created_at) = ', inputYear);
    END IF;

    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //

DELIMITER ;


-- Daily Report for a Specific Date:
CALL GenerateReport('sales', 'daily', '2025-01-01', NULL, NULL);

-- Weekly Report for a Specific Date:
CALL GenerateReport('sales', 'weekly', '2025-01-01', NULL, NULL);

-- Monthly Report for a Specific Month and Year:
CALL GenerateReport('sales', 'monthly', NULL, 1, 2025);

-- Yearly Report for a Specific Year:
CALL GenerateReport('sales', 'yearly', NULL, NULL, 2025);
This approach makes the procedure flexible and allows you to generate reports for any specified date, month, or year.