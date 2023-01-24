import time
import pandas as pd
import sqlalchemy as sa

def main():
    print("Attempting to create bikingdata.db and import csv files.")
    # File locations of the City bike journey data csv files
    trips = ["databaseimports\\2021-05.csv",
            "databaseimports\\2021-06.csv",
            "databaseimports\\2021-07.csv"]

    # File location of the HSL City bike stations csv file
    stations = "databaseimports\stations.csv"

    engine = sa.create_engine('sqlite:///bikingdata.db')
    inspector = sa.inspect(engine)

    if "trips" in inspector.get_table_names():
        print("Please delete bikingdata.db and run this script again.")
    else:
        start = time.time()
        print("Importing trips...")
        for csv in trips:
            print("Importing " + csv)
            importCsv(engine, "trips", csv, validateJourney)

        print("Importing stations...")
        importCsv(engine, "stations", stations, validateStation)
        end = time.time()
        print("Done in " + str(round(end - start)) + " seconds!")
    

def validateJourney(row):
    # Minimum valid distance in meters
    min_distance = 10
    # Minimum valid duration in seconds
    min_duration = 10

    return row["Duration (sec.)"] >= min_duration and row["Covered distance (m)"] >= min_distance

def validateStation(row):
    return True

def importCsv(engine, tableName, uri, validationFunction):
    chunk_size = 10000

    # Iterate through the csv file in chunks and append to the database table.
    for df in pd.read_csv(uri, chunksize=chunk_size):
        valid_rows = []

        # Validate each row
        for index, row in df.iterrows():
                if validationFunction(row):
                    valid_rows.append(row.to_dict())

        valid_df = pd.DataFrame(valid_rows)
        valid_df.to_sql(tableName, engine, if_exists='append')

if __name__ == "__main__":
	main()
